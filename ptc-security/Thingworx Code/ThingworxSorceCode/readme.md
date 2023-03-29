# Data Converter

## XML
## JSON
## CSV
## SCHEMA


### Steps
#### 1. Build a Gem
```bash
gem build jruby-jar-datahandler.gemspec
gem install ./jruby-jar-datahandler-1.0.0.gem
```
remove the gem if not needed
```bash
rm ./jruby-jar-datahandler-1.0.0.gem
gem uninstall jruby-jar-datahandler
```
#### 2. Test the Gem
```bash
irb
```
```ruby
require 'jruby-jar-datahandler'
JRubyJarDatahandler::HandleXmlClass.run_test_sample
```
#### 3. Generate JAR file
```
warble compiled jar
java -jar data_converter.jar
```


### Reference Notes
Generated JAR file form Ruby gemset. (Procedure Reference notes: [Here](http://ericlondon.com/2013/10/04/ahead-of-time-compiling-jruby-packaging-a-java-jar-creating-a-gemspec-using-warbler.html) )

##### Plugins used
1. [warble](https://github.com/jruby/warbler) : Used to convert Jruby to JAR.
2. [json-schema-generator](https://github.com/maxlinc/json-schema-generator) : JSON to Schema Generator (draft-3 and draft-4).
3. [nokogiri](https://github.com/sparklemotion/nokogiri) : XML Parser
4. [nori](https://github.com/savonrb/nori) : XML Hash Translator
