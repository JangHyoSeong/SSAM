package com.ssafy.ssam.global.amazonS3.service;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.ssafy.ssam.global.amazonS3.config.S3Config;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class S3TextService {
    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucketName}")
    private String bucket;

    @Transactional
    public String readText(String sessionId){
        S3Object o = amazonS3.getObject(bucket, sessionId+"/"+sessionId+".txt");

        StringBuilder sb = new StringBuilder();
        String text;
        try {
            S3ObjectInputStream ois = o.getObjectContent();
            text = new String(ois.readAllBytes(),StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
//        System.out.println(text);
        return text;
    }


}
