/*
 Navicat Premium Dump SQL

 Source Server         : test_db
 Source Server Type    : MySQL
 Source Server Version : 90400 (9.4.0)
 Source Host           : 127.0.0.1:3306
 Source Schema         : test_express

 Target Server Type    : MySQL
 Target Server Version : 90400 (9.4.0)
 File Encoding         : 65001

 Date: 30/08/2025 15:59:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for expenses
-- ----------------------------
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL COMMENT '创建人id',
  `eat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '吃',
  `drink` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '喝',
  `play` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '玩',
  `glad` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '乐',
  `tolls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '过路费',
  `oil` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '车油',
  `parking` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '停车',
  `traffic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '交通',
  `supermarket` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '超市',
  `online_shopping` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '网购',
  `phone_bill` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '话费',
  `red_packet` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '红包',
  `create_date` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '花销明细' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of expenses
-- ----------------------------
INSERT INTO `expenses` VALUES (1, 1, '1', '2', '3', '4', '5', '6', '7', NULL, '8', '9', NULL, NULL, '2025-08-01 16:14:52');
INSERT INTO `expenses` VALUES (5, 1, '1,1,32,8,7', '998,99', NULL, NULL, '78', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 15:26:26');
INSERT INTO `expenses` VALUES (7, 1, '8,9,42', '998,98', '300,330', NULL, '78,69', '208', NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-30 09:39:45');
INSERT INTO `expenses` VALUES (26, 22, '89', '6', '300,400', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-30 15:45:16');
INSERT INTO `expenses` VALUES (27, 5, '', '', '800', NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-30 15:48:29');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `age` int NULL DEFAULT NULL,
  `sex` int NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '大帅', 33, 1, '123456', '13411111111', '2025-08-19 15:44:09');
INSERT INTO `user` VALUES (3, '张三', 20, 2, '123456', '13433333333', '2025-08-19 16:49:24');
INSERT INTO `user` VALUES (4, '李四', 18, 1, '123456', '13444444444', '2025-08-19 16:53:36');
INSERT INTO `user` VALUES (5, '王五', 49, 2, '123456', '13455555555', '2025-08-19 17:28:36');
INSERT INTO `user` VALUES (6, '陈六', 16, 1, '123456', '13466666666', '2025-08-20 16:40:01');
INSERT INTO `user` VALUES (7, '李七', 20, 1, '123456', '13477777777', '2025-08-25 15:37:41');
INSERT INTO `user` VALUES (14, '王八', 38, 2, '123456', '13488888888', '2025-08-25 15:48:04');
INSERT INTO `user` VALUES (22, '龙九', 99, 1, '123456', '13499999999', '2025-08-25 16:16:35');
INSERT INTO `user` VALUES (27, '叔十', 56, 1, '123456', '13410101010', '2025-08-25 16:47:06');
INSERT INTO `user` VALUES (28, '十一', 33, 1, '123456', '13411011011', '2025-08-30 14:50:18');

SET FOREIGN_KEY_CHECKS = 1;
