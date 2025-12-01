package com.petadoption.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Cat {
    @Id
    private int id;
    private String name;
    private int age;
    private String breed;
    private String image;
    private boolean available;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getBreed() {
		return breed;
	}
	public void setBreed(String breed) {
		this.breed = breed;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public boolean isAvailable() {
		return available;
	}
	public void setAvailable(boolean available) {
		this.available = available;
	}
	public Cat() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Cat(int id, String name, int age, String breed, String image, boolean available) {
		super();
		this.id = id;
		this.name = name;
		this.age = age;
		this.breed = breed;
		this.image = image;
		this.available = available;
	}

    
}
