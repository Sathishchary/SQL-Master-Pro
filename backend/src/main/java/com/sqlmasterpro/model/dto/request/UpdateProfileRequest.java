package com.sqlmasterpro.model.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String bio;
    private String phone;
    private String profilePicture;
}
