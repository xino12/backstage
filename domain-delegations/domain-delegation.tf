# OPS-REQ - {{ values.subdomain }}
testatata
a

module "testatata-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "testatata."
  ns       = "a"
}