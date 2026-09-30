package com.stacklens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(exclude = {
    // Exclude strict startup failures if local Redis or RabbitMQ are not actively running
    RedisAutoConfiguration.class,
    RedisRepositoriesAutoConfiguration.class,
    RabbitAutoConfiguration.class
})
@EnableAsync
public class StackLensApplication {

    public static void main(String[] args) {
        SpringApplication.run(StackLensApplication.class, args);
    }
}
