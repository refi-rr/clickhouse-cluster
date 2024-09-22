# clickhouse-cluster
what is this ? this is docker compose setup for clickhouse cluster with ch-keeper and ch proxy (for balance)
#additional:
- mount clickhouse log to host
- you can replace clickhouse keeper by apache zookeeper. You just replace the image and config the clickhouse server config.xml
