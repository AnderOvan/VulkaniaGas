package com.Vulkania.ev3.vulkanIA;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class VulkanIaApplication {

	public static void main(String[] args) {
		SpringApplication.run(VulkanIaApplication.class, args);
	}

}
