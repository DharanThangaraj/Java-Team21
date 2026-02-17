package main.java.com.ksr.campus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ksr.campus.entity.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

}
