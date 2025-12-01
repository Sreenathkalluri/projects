export const acceptAdoptionRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/adoptions/accept/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error accepting request:", errorText);
        throw new Error(errorText || "Failed to accept adoption request");
      }
  
      const result = await response.json();
      console.log("Adoption request accepted:", result);
      return result;
    } catch (error) {
      console.error("Network or server error:", error.message);
      throw error;
    }
  };
  