package com.ksr.campus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ksr.campus.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
