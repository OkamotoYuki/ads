SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

ALTER TABLE `ads`.`monitor_node` ADD COLUMN `delete_flag` TINYINT(1) NOT NULL DEFAULT 0  AFTER `publish_status` , ADD COLUMN `created` DATETIME NULL DEFAULT NULL  AFTER `delete_flag` , ADD COLUMN `modified` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  AFTER `created` ;

CREATE  TABLE IF NOT EXISTS `ads`.`tag` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `label` VARCHAR(1024) NOT NULL ,
  `created` DATETIME NULL DEFAULT NULL ,
  `modified` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

CREATE  TABLE IF NOT EXISTS `ads`.`dcase_tag_rel` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `dcase_id` INT(11) NOT NULL ,
  `tag_id` INT(11) NOT NULL ,
  `created` DATETIME NULL DEFAULT NULL ,
  `modified` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_dcase_tag_rel_dcase1` (`dcase_id` ASC) ,
  INDEX `fk_dcase_tag_rel_tag1` (`tag_id` ASC) ,
  CONSTRAINT `fk_dcase_tag_rel_dcase1`
    FOREIGN KEY (`dcase_id` )
    REFERENCES `ads`.`dcase` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_dcase_tag_rel_tag1`
    FOREIGN KEY (`tag_id` )
    REFERENCES `ads`.`tag` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

DROP TABLE IF EXISTS `ads`.`node_property` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
