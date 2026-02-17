package com.ksr.campus.dto;

import lombok.Data;
import com.ksr.campus.enums.Role;

@Data
public class UserRequestDTO {
    private String name;
    private String email;
    private String password;
    private Role role;
}
