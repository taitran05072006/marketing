package com.example.demo.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String primaryImageUrl;
    private Integer quantity;
    private BigDecimal price;
}
