# OpenQASM 3.0 playground

[![tests](https://github.com/itsubaki/qasm-playground/workflows/tests/badge.svg)](https://github.com/itsubaki/qasm-playground/actions)
[![codecov](https://codecov.io/gh/itsubaki/qasm-playground/branch/main/graph/badge.svg?token=iNccCs1Tez)](https://codecov.io/gh/itsubaki/qasm-playground)

 - A playground that lets you write and run OpenQASM code in a web browser.

## Deployment and Configuration

 1. Deploy [quasar](https://github.com/itsubaki/quasar) to Google Cloud Run.
 1. Deploy qasm-playground to Vercel.
 1. Set the `GOOGLE_CLOUD_SERVICE_URL` environment variable in your Vercel project.

## Related Projects

 - [itsubaki/q](https://github.com/itsubaki/q) Quantum computation simulator for Go
 - [itsubaki/qasm](https://github.com/itsubaki/qasm) Quantum computation simulator with OpenQASM
 - [itsubaki/quasar](https://github.com/itsubaki/quasar) Quantum computation simulator as a Service
