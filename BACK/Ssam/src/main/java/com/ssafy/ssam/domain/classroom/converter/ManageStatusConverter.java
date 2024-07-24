package com.ssafy.ssam.domain.classroom.converter;


import com.ssafy.ssam.domain.classroom.entity.ManageStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ManageStatusConverter implements AttributeConverter<ManageStatus, String> {


    @Override
    public String convertToDatabaseColumn(ManageStatus status) {

        return status.getLegacyCode();
    }

    @Override
    public ManageStatus convertToEntityAttribute(String dbData) {

        return ManageStatus.ofLegacyCode(dbData);
    }
}
