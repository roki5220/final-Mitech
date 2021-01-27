package com.etoile.app.rental.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.etoile.app.rental.mapper.RentalMapper;
import com.etoile.app.rental.service.RentalService;
import com.etoile.app.vo.ProductVO;
import com.etoile.app.vo.RentalVO;

@Service("rentalService")
public class RentalServiceImpl implements RentalService {
	
	@Autowired
	private RentalMapper dao;
	
	@Override
	public List<ProductVO> rentalProductList(ProductVO vo) {
		return dao.rentalProductList(vo);
	}
	@Override
	public ProductVO rentalProductSelect(ProductVO vo) {
		return dao.rentalProductSelect(vo);
	}
	
	@Override
	public int RentalInsert(RentalVO vo) {
		return dao.RentalInsert(vo);
	}
	@Override
	public List<ProductVO> searchList(ProductVO vo) {
		return dao.searchList(vo);
	}
	@Override
	public int productCnt(ProductVO vo) {
		return dao.productCnt(vo);
	}
	
	
	
}