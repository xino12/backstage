# OPS-REQ - {{ values.subdomain }}
test
a

module "test-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "test."
  ns       = "a"
}