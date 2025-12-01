package com.petadoption.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Fish {
    @Id
    private int id;
    private String name;
    private int age;
    private String species;
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
	public String getSpecies() {
		return species;
	}
	public void setSpecies(String species) {
		this.species = species;
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
	public Fish(int id, String name, int age, String species, String image, boolean available) {
		super();
		this.id = id;
		this.name = name;
		this.age = age;
		this.species = species;
		this.image = image;
		this.available = available;
	}
	public Fish() {
		super();
		// TODO Auto-generated constructor stub
	}

    // Getters and Setters
}
