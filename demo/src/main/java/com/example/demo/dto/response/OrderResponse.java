package com.example.demo.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderResponse {
    private Long id;
    private String orderCode;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
}
