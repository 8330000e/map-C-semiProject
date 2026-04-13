package kr.co.iei.config;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class CartTableInitializer {
    private static final Logger logger = LoggerFactory.getLogger(CartTableInitializer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initCartTable() {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM USER_TABLES WHERE TABLE_NAME = ?",
                    Integer.class,
                    "CART_TBL");

            if (count == null || count == 0) {
                logger.info("CART_TBL 테이블이 없으므로 생성합니다.");
                jdbcTemplate.execute("CREATE TABLE CART_TBL ("
                        + "CART_NO NUMBER PRIMARY KEY, "
                        + "MEMBER_ID VARCHAR2(20 BYTE), "
                        + "MARKET_NO NUMBER, "
                        + "QUANTITY NUMBER, "
                        + "ADDED_AT DATE"
                        + ")");
                jdbcTemplate.execute("CREATE SEQUENCE CART_SEQ START WITH 1 INCREMENT BY 1");
                logger.info("CART_TBL 테이블이 생성되었습니다.");
            } else {
                Integer seqCount = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM USER_SEQUENCES WHERE SEQUENCE_NAME = ?",
                        Integer.class,
                        "CART_SEQ");
                if (seqCount == null || seqCount == 0) {
                    jdbcTemplate.execute("CREATE SEQUENCE CART_SEQ START WITH 1 INCREMENT BY 1");
                    logger.info("CART_SEQ 시퀀스를 생성했습니다.");
                }
                logger.debug("CART_TBL 테이블이 이미 존재합니다.");
            }
        } catch (Exception e) {
            logger.warn("CART_TBL 테이블 확인 또는 생성 중 오류가 발생했습니다.", e);
        }
    }
}
