package com.boda.backend.content;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BankAccountInfoRepository extends JpaRepository<BankAccountInfo, Long> {
    List<BankAccountInfo> findAllByOrderByOrderIndexAsc();
    List<BankAccountInfo> findByEnabledTrueOrderByOrderIndexAsc();
}
