SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `tasksdb` DEFAULT CHARACTER SET utf8 ;

USE `tasksdb` ;


CREATE TABLE IF NOT EXISTS `tasksdb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `document` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `role` INT NOT NULL,
  `resetPasswordToken` VARCHAR(255),
  `resetPasswordExpires` DATE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tasksdb`.`priority` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tasksdb`.`status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tasksdb`.`tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(45) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `description` LONGTEXT NOT NULL,
  `priority_id` INT NOT NULL,
  `status_id` INT NOT NULL,
  `users_id` INT(11) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tasks_priority_idx` (`priority_id` ASC),
  INDEX `fk_tasks_status1_idx` (`status_id` ASC),
  INDEX `fk_tasks_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_tasks_priority`
    FOREIGN KEY (`priority_id`)
    REFERENCES `tasksdb`.`priority` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_status1`
    FOREIGN KEY (`status_id`)
    REFERENCES `tasksdb`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `tasksdb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tasksdb`.`task_comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comment` LONGTEXT NOT NULL,
  `tasks_id` INT NOT NULL,
  `users_id` INT(11) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_task_comment_tasks1_idx` (`tasks_id` ASC),
  INDEX `fk_task_comment_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_task_comment_tasks1`
    FOREIGN KEY (`tasks_id`)
    REFERENCES `tasksdb`.`tasks` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_task_comment_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `tasksdb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `tasksdb`.`task_files` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file` VARCHAR(255) NOT NULL,
  `tasks_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_task_files_tasks1_idx` (`tasks_id` ASC),
  CONSTRAINT `fk_task_files_tasks1`
    FOREIGN KEY (`tasks_id`)
    REFERENCES `tasksdb`.`tasks` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
