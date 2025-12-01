package com.petadoption.service;

import com.petadoption.entity.*;
import com.petadoption.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired private DogRepo dogRepo;
    @Autowired private CatRepo catRepo;
    @Autowired private FishRepo fishRepo;
    @Autowired private HamsterRepo hamsterRepo;
    @Autowired private AdoptionRepo adoptionRepo;
    @Autowired private UserRepo userRepo;

    // ==================== GET ALL PETS ====================

    public List<Dog> getDogs() {
        return dogRepo.findAll();
    }

    public List<Cat> getCats() {
        return catRepo.findAll();
    }

    public List<Fish> getFish() {
        return fishRepo.findAll();
    }

    public List<Hamster> getHamsters() {
        return hamsterRepo.findAll();
    }

    // ==================== SAVE or UPDATE PET ====================

    public Dog saveDog(Dog dog) {
        return dogRepo.save(dog);
    }

    public Cat saveCat(Cat cat) {
        return catRepo.save(cat);
    }

    public Fish saveFish(Fish fish) {
        return fishRepo.save(fish);
    }

    public Hamster saveHamster(Hamster hamster) {
        return hamsterRepo.save(hamster);
    }

    // ==================== DELETE PET ====================

    public void deleteDog(Integer id) {
        dogRepo.deleteById(id);
    }

    public void deleteCat(Integer id) {
        catRepo.deleteById(id);
    }

    public void deleteFish(Integer id) {
        fishRepo.deleteById(id);
    }

    public void deleteHamster(Integer id) {
        hamsterRepo.deleteById(id);
    }

    // ==================== ADOPTION REQUESTS ====================

    // Create or update adoption request
    public AdoptionRequest saveAdoption(AdoptionRequest req) {
        return adoptionRepo.save(req);
    }

    // Get all adoption requests
    public List<AdoptionRequest> getAllAdoptions() {
        return adoptionRepo.findAll();
    }

    // Get adoption requests by email
    public List<AdoptionRequest> getAdoptionsByEmail(String email) {
        return adoptionRepo.findByEmail(email);
    }

    // Delete adoption request by ID
    public void deleteAdoption(Integer id) {
        adoptionRepo.deleteById(id);
    }

    // Optional: update an existing adoption request
    public AdoptionRequest updateAdoption(Integer id, AdoptionRequest newReq) {
        Optional<AdoptionRequest> existingOpt = adoptionRepo.findById(id);
        if (existingOpt.isPresent()) {
            AdoptionRequest existing = existingOpt.get();
            existing.setAdopterName(newReq.getAdopterName());
            existing.setEmail(newReq.getEmail());
            existing.setMobile(newReq.getMobile());
            existing.setAddress(newReq.getAddress());
            existing.setPetType(newReq.getPetType());
            existing.setPetId(newReq.getPetId());
            return adoptionRepo.save(existing);
        }
        return null;
    }

    // Get pet details for a given pet type and ID
    public Object getPetDetails(String petType, Integer petId) {
        switch (petType.toLowerCase()) {
            case "dog":
                return dogRepo.findById(petId).orElse(null);
            case "cat":
                return catRepo.findById(petId).orElse(null);
            case "fish":
                return fishRepo.findById(petId).orElse(null);
            case "hamster":
                return hamsterRepo.findById(petId).orElse(null);
            default:
                return null;
        }
    }
 // Accept an adoption request by setting accepted = true
    public boolean acceptAdoptionRequest(Integer requestId) {
        Optional<AdoptionRequest> optional = adoptionRepo.findById(requestId);
        if (optional.isPresent()) {
            AdoptionRequest req = optional.get();
            req.setAccepted(true); // Ensure this field exists in your AdoptionRequest entity
            adoptionRepo.save(req);
            return true;
        }
        return false;
    }


    // ==================== USER AUTH ====================

    // Sign up a new user
    public User signup(User user) {
        if (user.getRole() == null) {
            user.setRole(User.Role.customer);
        }
        return userRepo.save(user);
    }

    // Login user by credentials
    public User login(String username, String password) {
        User user = userRepo.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // Optional: Get all users (for admin)
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // Optional: Find user by username
    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }
}
