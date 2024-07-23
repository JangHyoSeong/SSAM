package com.ssafy.ssam.analytics.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "login_log")
public class LoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "login_log_id")
    private int loginLogId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private int userId;

    @NotNull
    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "login_time", columnDefinition = "TIMESTAMP", nullable = false)
    private Date loginTime;

    @NotNull
    @Column(name = "ip_address", nullable = false, length = 15)
    private String ipAddress;

    @NotNull
    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private int success;

}
