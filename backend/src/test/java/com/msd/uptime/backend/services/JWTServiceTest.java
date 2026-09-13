package com.msd.uptime.backend.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JWTServiceTest {

    private final JWTService jwtService = new JWTService();

    @BeforeEach
    void setUp() {
        String secret = Base64.getEncoder().encodeToString(
                "test-secret-key-that-is-longer-than-thirty-two-bytes-length"
                        .getBytes(StandardCharsets.UTF_8));
        ReflectionTestUtils.setField(jwtService, "secret", secret);
    }

    @Test
    void generateToken_returnsTokenWhoseSubjectIsTheEmail() {
        ReflectionTestUtils.setField(jwtService, "expirationTime", 3_600_000L);

        String token = jwtService.generateToken("user@test.com");

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractLoginIdentifier(token)).isEqualTo("user@test.com");
    }

    @Test
    void extractExpiration_returnsAFutureDate() {
        ReflectionTestUtils.setField(jwtService, "expirationTime", 3_600_000L);

        Date expiration = jwtService.extractExpiration(jwtService.generateToken("user@test.com"));

        assertThat(expiration).isAfter(new Date(System.currentTimeMillis() - 1_000L));
    }

    @Test
    void createToken_embedsCustomClaimsAndSubject() {
        ReflectionTestUtils.setField(jwtService, "expirationTime", 3_600_000L);

        String token = jwtService.createToken(Map.of("role", "HEAD"), "admin@test.com");

        assertThat(jwtService.extractLoginIdentifier(token)).isEqualTo("admin@test.com");
        String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));
        assertThat(role).isEqualTo("HEAD");
    }

    @Test
    void validateToken_returnsTrueForMatchingUser() {
        ReflectionTestUtils.setField(jwtService, "expirationTime", 3_600_000L);
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("user@test.com");

        String token = jwtService.generateToken("user@test.com");

        assertThat(jwtService.validateToken(token, userDetails)).isTrue();
    }

    @Test
    void validateToken_returnsFalseForDifferentUser() {
        ReflectionTestUtils.setField(jwtService, "expirationTime", 3_600_000L);
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("other@test.com");

        String token = jwtService.generateToken("user@test.com");

        assertThat(jwtService.validateToken(token, userDetails)).isFalse();
    }

    @Test
    void validateToken_throwsForExpiredToken() {
        ReflectionTestUtils.setField(jwtService, "expirationTime", -60_000L);
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("user@test.com");

        String token = jwtService.generateToken("user@test.com");

        assertThatThrownBy(() -> jwtService.validateToken(token, userDetails))
                .isInstanceOf(io.jsonwebtoken.ExpiredJwtException.class);
    }
}