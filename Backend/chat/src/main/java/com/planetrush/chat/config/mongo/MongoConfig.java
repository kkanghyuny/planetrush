package com.planetrush.chat.config.mongo;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

	@Value("${spring.data.mongodb.uri}")
	private String mongoUri;

	@Override
	protected void configureConverters(MongoCustomConversions.MongoConverterConfigurationAdapter adapter) {
		adapter.registerConverter(new LocalDateTimeReadConverter());
	}

	private static class LocalDateTimeReadConverter implements Converter<Date, LocalDateTime> {
		@Override
		public LocalDateTime convert(Date source) {
			return LocalDateTime.ofInstant(source.toInstant(), ZoneId.of("Asia/Seoul"));
		}
	}

	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create(mongoUri);
	}

	@Override
	protected String getDatabaseName() {
		return "chat_log";
	}
}