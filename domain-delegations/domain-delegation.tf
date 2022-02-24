# OPS-REQ - {{ values.subdomain }}
backstage-test
a

module "backstage-test-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "backstage-test."
  ns       = "a"
}