package com.ssafy.ssam.global.amazonS3.service;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

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

        S3Object o = amazonS3.getObject(new GetObjectRequest(bucket, sessionId+"/"+sessionId));
        StringBuilder sb=new StringBuilder();

        try (S3ObjectInputStream ois = o.getObjectContent();
            BufferedReader br = new BufferedReader (new InputStreamReader(ois, "UTF-8"))){
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println(sb.toString());
        return sb.toString();
    }


}
