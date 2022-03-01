# OPS-REQ - {{ values.subdomain }}
demo-insights
a

module "demo-insights-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "demo-insights."
  ns       = "a"
}