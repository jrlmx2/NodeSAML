<h1>NodeSAML</h1>

Node SAML is an implementation of the entire SAML 2.0
specification in JavaScript that runes on NodeJS. The specification
includes Identity Provider specification, Service Provider specification, and 
transmistion requirements. There is a stretch goal creating an
angular service that submits assertions based on the specification
details.

There is a secondary intention of utilizing native JavaScript promise
queues for assertion creation and resolution.

Any and all help is welcome. Please read the pdf 
<a href="http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf">SAML 2.0</a> 
before you contibute. Also, please make variable and function names
align with the SAML 2.0 PDF specification verbage. Finally, see coding
style information below. All communication will happen through
github.

A style guide for coding regulations is in progress. Until the style
guide is released, please use the code located in
identity_provider/lib/utc.js as bible for code and comment form.
