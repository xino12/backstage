# OPS-REQ - {{ values.subdomain }}
testa
ab

module "testa-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "testa."
  ns       = "ab"
}