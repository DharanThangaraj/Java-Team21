package com.ksr.campus.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import com.ksr.campus.service.UserService;
import com.ksr.campus.dto.LoginRequestDTO;
import com.ksr.campus.dto.UserRequestDTO;
import com.ksr.campus.dto.UserResponseDTO;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public UserResponseDTO createUser(@RequestBody UserRequestDTO userRequestDTO) {
        return userService.createUser(userRequestDTO);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody LoginRequestDTO loginRequest) {
        return userService.login(loginRequest);
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }
}
