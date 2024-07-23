package com.ssafy.ssam.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "login_log")
public class LoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "login_log_id")
    private Integer loginLogId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @NotNull
    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "login_time", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime loginTime;

    @NotNull
    @Column(name = "ip_address", nullable = false, length = 15)
    private String ipAddress;

    @NotNull
    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Integer success;

}
