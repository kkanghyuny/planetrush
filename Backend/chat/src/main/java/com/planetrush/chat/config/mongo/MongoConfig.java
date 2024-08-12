package com.planetrush.chat.config.mongo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

	@Value("${spring.data.mongodb.uri}")
	private String mongoUri;

	// @Override
	// protected void configureConverters(MongoCustomConversions.MongoConverterConfigurationAdapter adapter) {
	// adapter.registerConverter(new LocalDateTimeWriteConverter());
	// adapter.registerConverter(new LocalDateTimeReadConverter());
	// }

	// private static class LocalDateTimeWriteConverter implements Converter<LocalDateTime, Date> {
	// 	@Override
	// 	public Date convert(LocalDateTime source) {
	// 		return Date.from(source.atZone(ZoneId.of("Asia/Seoul")).toInstant());
	// 	}
	// }

	// private static class LocalDateTimeReadConverter implements Converter<Date, LocalDateTime> {
	// 	@Override
	// 	public LocalDateTime convert(Date source) {
	// 		return LocalDateTime.ofInstant(source.toInstant(), ZoneId.of("Asia/Seoul"));
	// 	}
	// }

	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create(mongoUri);
	}

	@Override
	protected String getDatabaseName() {
		return "chat_log";
	}
}