package com.ssafy.ssam.domain.consult.converter;

import com.ssafy.ssam.domain.consult.entity.ConsultTopic;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ConsultTopicConverter implements AttributeConverter<ConsultTopic, String> {

    @Override
    public String convertToDatabaseColumn(ConsultTopic consultTopic) {
        return consultTopic.getLegacyCode();
    }

    @Override
    public ConsultTopic convertToEntityAttribute(String dbData) {
        return ConsultTopic.ofLegacyCode(dbData);
    }
}
