# OPS-REQ - {{ values.subdomain }}
testaaa
a

module "testaaa-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "testaaa."
  ns       = "a"
}