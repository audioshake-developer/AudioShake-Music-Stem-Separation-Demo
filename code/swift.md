/**
 
 ContentView.swift
 AudioShake Music Separation Demo
 Developed for AudioShake by Dan Zeitman on 12/9/25.

Requires iOS 17.0 or later.
This demo uses modern SwiftUI and Swift concurrency features that are only fully supported on iOS 17+.
 
 Instructions:
 Create a new XCode project for IOS and replace the ContentView with this code.
 List tasks, tap on the TaskID to update the TaskID textfield for get task by ID

NOTE: The API key shown here is provided solely for demonstration.
For any production deployment, you should implement a secure authentication flow and avoid hard-coding API keys in client or frontend code.

*/

import Foundation
import PlaygroundSupport

// Global Configuration
let apiKey = "${api_key}"
let payload: [String: Any] = ${payload}

// API Response Models
struct TaskResponse: Decodable {
    let id: String
    let targets: [Target]?
    
    struct Target: Decodable {
        let model: String
        let status: String
        let output: [Output]?
        
        struct Output: Decodable {
            let format: String
            let link: String
        }
    }
}

// Function to Create Task
func createTask() async throws {
    print("🚀 Creating task...")
    
    let url = URL(string: "https://api.audioshake.ai/tasks")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try JSONSerialization.data(withJSONObject: payload)
    
    let (data, _) = try await URLSession.shared.data(for: request)
    // Basic error checking
    guard let response = try? JSONDecoder().decode(TaskResponse.self, from: data) else {
        if let text = String(data: data, encoding: .utf8) {
            print("Error parsing response: \(text)")
        }
        return
    }
    
    print("Created task: \(response.id)")
    
    try await pollTask(taskId: response.id)
}

// Function to Poll Task
func pollTask(taskId: String) async throws {
    let url = URL(string: "https://api.audioshake.ai/tasks/\(taskId)")!
    var request = URLRequest(url: url)
    request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
    
    while true {
        let (data, _) = try await URLSession.shared.data(for: request)
        let status = try JSONDecoder().decode(TaskResponse.self, from: data)
        
        guard let targets = status.targets else {
            print("Waiting for targets...")
            try await Task.sleep(nanoseconds: 2_000_000_000) // 2 seconds
            continue
        }
        
        let allDone = targets.allSatisfy { $0.status == "completed" }
        
        if allDone {
            print("\nAll targets completed.\n")
            for target in targets {
                print("Target: \(target.model)")
                for output in target.output ?? [] {
                    print("  - \(output.format): \(output.link)")
                }
            }
            break
        }
        
        print("Waiting...")
        try await Task.sleep(nanoseconds: 2_000_000_000) // 2 seconds
    }
}

// Main Execution
Task {
    do {
        try await createTask()
    } catch {
        print("❌ Error: \(error)")
    }
}

PlaygroundPage.current.needsIndefiniteExecution = true
