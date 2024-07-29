package com.ssafy.ssam.domain.notification.converter;

import com.ssafy.ssam.domain.notification.entity.AlarmType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class AlarmTypeConverter implements AttributeConverter<AlarmType, String> {


    @Override
    public String convertToDatabaseColumn(AlarmType alarmType) {
        return alarmType.getLegacyCode();
    }

    @Override
    public AlarmType convertToEntityAttribute(String dbData) {
        return AlarmType.ofLegacyCode(dbData);
    }
}
