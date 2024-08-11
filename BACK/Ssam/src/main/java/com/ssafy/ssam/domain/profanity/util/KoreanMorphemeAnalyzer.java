package com.ssafy.ssam.domain.profanity.util;

import java.util.List;

import org.springframework.stereotype.Component;

import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.KomoranResult;

@Component
public class KoreanMorphemeAnalyzer {

    private final Komoran komoran;

    public KoreanMorphemeAnalyzer() {
        this.komoran = new Komoran(DEFAULT_MODEL.FULL);
    }

    public List<String> analyzeMorphemes(String text) {
        KomoranResult analyzeResultList = komoran.analyze(text);
        return analyzeResultList.getNouns();  // 명사만 추출
    }

    public String analyzeAndJoin(String text) {
        List<String> morphemes = analyzeMorphemes(text);
        return String.join(" ", morphemes);
    }
}