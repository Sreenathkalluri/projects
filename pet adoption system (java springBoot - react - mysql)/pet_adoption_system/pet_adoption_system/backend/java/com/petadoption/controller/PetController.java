package com.petadoption.controller;

import com.petadoption.entity.*;
import com.petadoption.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService service;

    // ====================== GET All Pets =====================
    @GetMapping("/dogs")
    public ResponseEntity<List<Dog>> getDogs() {
        return ResponseEntity.ok(service.getDogs());
    }

    @GetMapping("/cats")
    public ResponseEntity<List<Cat>> getCats() {
        return ResponseEntity.ok(service.getCats());
    }

    @GetMapping("/fish")
    public ResponseEntity<List<Fish>> getFish() {
        return ResponseEntity.ok(service.getFish());
    }

    @GetMapping("/hamsters")
    public ResponseEntity<List<Hamster>> getHamsters() {
        return ResponseEntity.ok(service.getHamsters());
    }

    // ====================== POST Add Pets =====================
    @PostMapping("/dogs")
    public ResponseEntity<?> addDog(@RequestBody Dog dog) {
        if (dog.getName() == null || dog.getImage() == null) {
            return ResponseEntity.badRequest().body("Name and Image are required");
        }

        Dog saved = service.saveDog(dog);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/cats")
    public ResponseEntity<Cat> addCat(@RequestBody Cat cat) {
        return ResponseEntity.ok(service.saveCat(cat));
    }

    @PostMapping("/fish")
    public ResponseEntity<Fish> addFish(@RequestBody Fish fish) {
        return ResponseEntity.ok(service.saveFish(fish));
    }

    @PostMapping("/hamsters")
    public ResponseEntity<Hamster> addHamster(@RequestBody Hamster hamster) {
        return ResponseEntity.ok(service.saveHamster(hamster));
    }

    // ====================== PUT Update Pets =====================
    @PutMapping("/dogs/{id}")
    public ResponseEntity<Dog> updateDog(@PathVariable Integer id, @RequestBody Dog dog) {
        dog.setId(id);
        return ResponseEntity.ok(service.saveDog(dog));
    }

    @PutMapping("/cats/{id}")
    public ResponseEntity<Cat> updateCat(@PathVariable Integer id, @RequestBody Cat cat) {
        cat.setId(id);
        return ResponseEntity.ok(service.saveCat(cat));
    }

    @PutMapping("/fish/{id}")
    public ResponseEntity<Fish> updateFish(@PathVariable Integer id, @RequestBody Fish fish) {
        fish.setId(id);
        return ResponseEntity.ok(service.saveFish(fish));
    }

    @PutMapping("/hamsters/{id}")
    public ResponseEntity<Hamster> updateHamster(@PathVariable Integer id, @RequestBody Hamster hamster) {
        hamster.setId(id);
        return ResponseEntity.ok(service.saveHamster(hamster));
    }

    // ====================== DELETE Pets =====================
    @DeleteMapping("/dogs/{id}")
    public ResponseEntity<Void> deleteDog(@PathVariable Integer id) {
        service.deleteDog(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cats/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable Integer id) {
        service.deleteCat(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/fish/{id}")
    public ResponseEntity<Void> deleteFish(@PathVariable Integer id) {
        service.deleteFish(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/hamsters/{id}")
    public ResponseEntity<Void> deleteHamster(@PathVariable Integer id) {
        service.deleteHamster(id);
        return ResponseEntity.noContent().build();
    }

    // ====================== ADOPTION REQUEST =====================
    @PostMapping("/adopt")
    public ResponseEntity<?> adoptPet(@RequestBody AdoptionRequest req) {
        // Validate required fields
        if (req.getAdopterName() == null || req.getAdopterName().isEmpty() ||
            req.getEmail() == null || req.getEmail().isEmpty() ||
            req.getMobile() == null || req.getMobile().isEmpty() ||
            req.getAddress() == null || req.getAddress().isEmpty() ||
            req.getPetType() == null || req.getPetType().isEmpty() ||
            req.getPetId() == null || req.getPetId() == 0) {

            return ResponseEntity.badRequest().body("❌ Please fill all required fields.");
        }

        try {
            System.out.println("📥 Adoption Request Received: " + req);

            AdoptionRequest saved = service.saveAdoption(req);
            return ResponseEntity.ok().body("✅ Adoption request submitted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Failed to submit adoption request.");
        }
    }


    @GetMapping("/adoptions")
    public ResponseEntity<List<AdoptionRequest>> getAllAdoptions() {
        return ResponseEntity.ok(service.getAllAdoptions());
    }

    @GetMapping("/adoptions/{email}")
    public ResponseEntity<List<AdoptionRequest>> getAdoptionsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.getAdoptionsByEmail(email));
    }
    @PutMapping("/adoptions/accept/{id}")
    public ResponseEntity<?> acceptAdoptionRequest(@PathVariable("id") int requestId) {
        try {
            boolean updated = service.acceptAdoptionRequest(requestId);
            if (!updated) {
                return ResponseEntity.status(404).body("❌ Adoption request not found.");
            }
            return ResponseEntity.ok("✅ Adoption request accepted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Failed to accept adoption request.");
        }
    }


    // ====================== PET DETAILS by type & ID =====================
    @GetMapping("/pet-details")
    public ResponseEntity<Object> getPetDetails(@RequestParam String petType, @RequestParam Integer petId) {
        Object pet = service.getPetDetails(petType, petId);
        if (pet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pet);
    }

    
}
