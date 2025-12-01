package com.petadoption.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_requests")
public class AdoptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;

    private String adopterName;
    private String email;
    private String mobile;
    private String address;
    private String petType;
    private Integer petId;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    // ✅ New Field
    @Column(name = "accepted")
    private Boolean accepted = false;

    // Getters and Setters

    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }

    public String getAdopterName() {
        return adopterName;
    }

    public void setAdopterName(String adopterName) {
        this.adopterName = adopterName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPetType() {
        return petType;
    }

    public void setPetType(String petType) {
        this.petType = petType;
    }

    public Integer getPetId() {
        return petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ✅ New Getter and Setter
    public Boolean getAccepted() {
        return accepted;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    // Constructors

    public AdoptionRequest(Integer requestId, String adopterName, String email, String mobile, String address,
                           String petType, Integer petId, LocalDateTime createdAt, Boolean accepted) {
        this.requestId = requestId;
        this.adopterName = adopterName;
        this.email = email;
        this.mobile = mobile;
        this.address = address;
        this.petType = petType;
        this.petId = petId;
        this.createdAt = createdAt;
        this.accepted = accepted;
    }

    public AdoptionRequest() {
        // No-arg constructor
    }
}
