package com.ssafy.ssam;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class SsamApplicationTests {

	@Autowired
	MockMvc mockMvc;

	ObjectMapper om = new ObjectMapper();

	int grade = 3;
	int classroom = 3;
	@Test
	void contextLoads() {
	}


	@Test
	void 테스트() throws Exception{
		BoardCreateRequestDTO dto = new BoardCreateRequestDTO(3, 3);
		mockMvc.perform(post("/api/v1/classrooms/teachers")
				.contentType(MediaType.APPLICATION_JSON)
				.content(om.writeValueAsString(dto))
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

	}
}
