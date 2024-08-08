package com.planetrush.chat.config.mongo;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

	@Override
	protected void configureConverters(MongoCustomConversions.MongoConverterConfigurationAdapter adapter) {
		adapter.registerConverter(new LocalDateTimeWriteConverter());
		adapter.registerConverter(new LocalDateTimeReadConverter());
	}

	private static class LocalDateTimeWriteConverter implements Converter<LocalDateTime, Date> {
		@Override
		public Date convert(LocalDateTime source) {
			return Date.from(source.atZone(ZoneId.of("Asia/Seoul")).toInstant());
		}
	}

	private static class LocalDateTimeReadConverter implements Converter<Date, LocalDateTime> {
		@Override
		public LocalDateTime convert(Date source) {
			return LocalDateTime.ofInstant(source.toInstant(), ZoneId.of("Asia/Seoul"));
		}
	}

	@Override
	protected String getDatabaseName() {
		return "chat_log";
	}
}