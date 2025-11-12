import { describe, it, expect } from "vitest";
import { offersApi, customersApi, projectsApi } from "@/lib/api/client";

describe("offersApi", () => {
  it("should get all offers", async () => {
    const offers = await offersApi.getAll();
    expect(Array.isArray(offers)).toBe(true);
    expect(offers.length).toBeGreaterThan(0);
  });

  it("should get offer by id", async () => {
    const offer = await offersApi.getById("1");
    expect(offer).toBeDefined();
    expect(offer!.id).toBe("1");
  });

  it("should return undefined for non-existent offer", async () => {
    const offer = await offersApi.getById("non-existent");
    expect(offer).toBeUndefined();
  });
});

describe("customersApi", () => {
  it("should get all customers", async () => {
    const customers = await customersApi.getAll();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
  });

  it("should get customer by id", async () => {
    const customer = await customersApi.getById("1");
    expect(customer).toBeDefined();
    expect(customer!.id).toBe("1");
  });
});

describe("projectsApi", () => {
  it("should get all projects", async () => {
    const projects = await projectsApi.getAll();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("should get project by id", async () => {
    const project = await projectsApi.getById("1");
    expect(project).toBeDefined();
    expect(project!.id).toBe("1");
  });
});
