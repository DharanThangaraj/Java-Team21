package com.ksr.campus.dto;

import lombok.Data;
import com.ksr.campus.enums.Role;

@Data
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
