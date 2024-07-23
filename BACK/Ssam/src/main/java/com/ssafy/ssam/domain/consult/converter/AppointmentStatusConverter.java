package com.ssafy.ssam.domain.consult.converter;

import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class AppointmentStatusConverter implements AttributeConverter<AppointmentStatus, String> {

    @Override
    public String convertToDatabaseColumn(AppointmentStatus status) {

        return status.getLegacyCode();
    }

    @Override
    public AppointmentStatus convertToEntityAttribute(String dbData) {

        return AppointmentStatus.ofLegacyCode(dbData);
    }
}
