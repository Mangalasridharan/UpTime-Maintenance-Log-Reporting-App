package com.msd.uptime.backend.models;

import jakarta.persistence.*;


@Entity
@Table(name="Users")
public class User
{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="name", nullable=false)
    private String username;

    @Column(name="email", nullable=false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name="role", nullable=false)
    Role role;

    public User(){}

    public User(String username, String email, Role role) {
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public Role getRole()
    {
        return role;
    }

    public void setRole(Role role)
    {
        this.role = role;
    }
}
