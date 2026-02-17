package com.ksr.campus.config;

import com.ksr.campus.entity.Resource;
import com.ksr.campus.entity.User;
import com.ksr.campus.entity.Booking;
import com.ksr.campus.enums.Role;
import com.ksr.campus.enums.Status;
import com.ksr.campus.repository.ResourceRepository;
import com.ksr.campus.repository.UserRepository;
import com.ksr.campus.repository.BookingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ResourceRepository repository, UserRepository userRepository,
            BookingRepository bookingRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@ksr.edu");
                admin.setPassword("password");
                admin.setRole(Role.ADMIN);

                User faculty = new User();
                faculty.setName("Faculty User");
                faculty.setEmail("faculty@ksr.edu");
                faculty.setPassword("password");
                faculty.setRole(Role.FACULTY);

                User student = new User();
                student.setName("Student User");
                student.setEmail("student@ksr.edu");
                student.setPassword("password");
                student.setRole(Role.STUDENT);

                userRepository.saveAll(Arrays.asList(admin, faculty, student));
                System.out.println("Users seeded: admin@ksr.edu, faculty@ksr.edu, student@ksr.edu");
            }

            if (repository.count() == 0) {
                Resource[] resources = {
                        createResource("Physics Lab", "LAB", 40),
                        createResource("Chemistry Lab", "LAB", 40),
                        createResource("Biology Lab", "LAB", 40),
                        createResource("CS Lab 1", "LAB", 60),
                        createResource("CS Lab 2", "LAB", 60),
                        createResource("Electronics Lab", "LAB", 30),
                        createResource("Mechanical Workshop", "LAB", 50),
                        createResource("Language Lab", "LAB", 30),
                        createResource("Main Seminar Hall", "SEMINAR_HALL", 200),
                        createResource("Mini Auditorium", "SEMINAR_HALL", 100),
                        createResource("Executive Conference Room", "SEMINAR_HALL", 30),
                        createResource("Classroom 101", "CLASSROOM", 60),
                        createResource("Classroom 102", "CLASSROOM", 60),
                        createResource("Classroom 103", "CLASSROOM", 60),
                        createResource("Classroom 201", "CLASSROOM", 60),
                        createResource("Classroom 202", "CLASSROOM", 60),
                        createResource("Smart Classroom 301", "CLASSROOM", 40),
                        createResource("Library Discussion Room", "CLASSROOM", 15)
                };
                List<Resource> savedResources = repository.saveAll(Arrays.asList(resources));
                System.out.println("Database seeded with " + resources.length + " resources.");

                // Seed some initial bookings
                if (bookingRepository.count() == 0) {
                    User student = userRepository.findAll().stream().filter(u -> u.getRole() == Role.STUDENT)
                            .findFirst()
                            .orElse(null);
                    Resource physicsLab = savedResources.stream().filter(r -> r.getName().equals("Physics Lab"))
                            .findFirst()
                            .orElse(null);
                    Resource csLab1 = savedResources.stream().filter(r -> r.getName().equals("CS Lab 1")).findFirst()
                            .orElse(null);

                    if (student != null && physicsLab != null) {
                        Booking b1 = new Booking();
                        b1.setUser(student);
                        b1.setResource(physicsLab);
                        b1.setStartTime(LocalDateTime.now().plusHours(1));
                        b1.setEndTime(LocalDateTime.now().plusHours(2));
                        b1.setPurpose("Project Mini-Hackathon");
                        b1.setStatus(Status.APPROVED);
                        b1.setParticipants(25);
                        bookingRepository.save(b1);
                    }

                    if (student != null && csLab1 != null) {
                        Booking b2 = new Booking();
                        b2.setUser(student);
                        b2.setResource(csLab1);
                        b2.setStartTime(LocalDateTime.now().plusHours(3));
                        b2.setEndTime(LocalDateTime.now().plusHours(5));
                        b2.setPurpose("Final Exam Prep");
                        b2.setStatus(Status.APPROVED);
                        b2.setParticipants(30);
                        bookingRepository.save(b2);
                    }
                    System.out.println("Initial approved bookings seeded.");
                }
            }
        };
    }

    private Resource createResource(String name, String type, int capacity) {
        Resource r = new Resource();
        r.setName(name);
        r.setType(type);
        r.setCapacity(capacity);
        return r;
    }
}
