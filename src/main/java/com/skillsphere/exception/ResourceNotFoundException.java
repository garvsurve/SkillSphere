package com.skillsphere.exception;

/**
 * Thrown when a requested entity (User, Skill, etc.) is not found in the DB.
 * Mapped to HTTP 404 by GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
