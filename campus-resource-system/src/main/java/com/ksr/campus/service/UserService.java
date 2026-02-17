package com.ksr.campus.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.ksr.campus.repository.UserRepository;
import com.ksr.campus.entity.User;
import com.ksr.campus.dto.UserRequestDTO;
import com.ksr.campus.dto.UserResponseDTO;
import com.ksr.campus.dto.LoginRequestDTO;
import com.ksr.campus.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(userRequestDTO.getPassword());
        user.setRole(userRequestDTO.getRole());
        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public UserResponseDTO login(LoginRequestDTO loginRequest) {
        String trimmedEmail = loginRequest.getEmail().trim();
        User user = userRepository.findByEmailIgnoreCase(trimmedEmail)
                .filter(u -> u.getPassword().equals(loginRequest.getPassword()))
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        return mapToDTO(user);
    }

    private UserResponseDTO mapToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
