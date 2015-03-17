;(function(){
    /*where the module will be returned*/
    var timeManager;

    function timeManagerInit(){
        /*object variable for storing local UTC Time*/
        var currentUtcTime,
            re_utc_format_validation,
        /*variable for storing object functions*/
            Encapsulation;


        /* to performance test both, for now, using format validation for utc format validation */
        re_utc_format_validation="^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):\([0-9]{2}):\([0-9]{2})\.([0-9]{3})Z";

        /* @private
         * Function updateCurrentTime
         *
         * Updates the current time of the object for comparison. 
         *
         * Other Notes: This function is called every time a time is validated
         */
        function updateCurrentTime(){

            /* store current UTC date */
            this.currentUtcTime = this.parseUtc(new Date().toIsoString());

        }

        /* @public
         * Function isValidAssertionTime
         *
         * Updates the current time of the object for comparison, and performe 
         * the comparisons defined by arg
         *
         * @param args(object) arguements for comparison. Each Key must be accompanied 
         * with a string representation of the Assertion UTC date value.
         * Possible Keys:
         * --NotBefore
         * --NotOnOrAfter
         *  *possibly more, more research required* TODO. 
         * @return (bool) if assertion conditions in args are true.
         *
         * Other Notes: This function is called every time a time is validated.
         */
        function isValidAssertionTime( args ){
            var notBefore,
                notOnOrAfter;

            this.updateCurrentTime();

            if( args.NotBefore ) {

                notBefore = this.parseUtc(args.NotBefore);
                if( notBefore ){

                    if( notBefore => this.currentUtcTime ){
                        return false;
                    }

                } else {

                    return false;

                }
            } else {

                return false;
            }

            if( args.NotOnOrAfter ) {

                notOnOrAfter = this.parseUtc(args.NotOnOrAfter);
                if( notOnOrAfter ){

                    if( notOnOrAfter < this.currentUtcTime ){
                        return false;
                    }

                } else {

                    return false;

                }
            } else {

                return false;
            }

            return true;

        }

        //TODO
        function assertionConidtionTriggerTime(){
        }

        /* @private
         * Function ValidateUtcFormat
         *
         * This function validates the format of the input date matches the 
         * universal UTC format.
         *
         * @param utc(string) UTC date string for validation
         * @returns (array|null) Array on success, null on failure
         * array positions:
         * --position 0 is match results or utc time(string)
         * --position 1 is the year(string)
         * --position 2 is the month(string)
         * --position 3 is the day(string)
         * --position 4 is the hour(string)
         * --position 5 is the minute(string)
         * --position 6 is the second(string)
         * --position 7 is the millisecond(string)
         *
         * Other notes: SAML 2.0 requires all dates for assertion validation are
         * in UTC format. If this call fails on any date validation required 
         * within the assertion, data within the assertion is indeterminate and
         * the assertion is invalidated.
         */
        function validateUtcFormat( utc ){
            return re_date_validation.exec( utc );

        }

        /* @private
         * Function parseUtc
         *
         * This function is intended to check the format of it input,
         * and validate the values of the date object. Each value is considered.
         *
         * @param utc(string) UTC date string
         * @returns(Date|bool) JavaScript Date object if is utc and validate date
         *
         * Other notes: The JavaScript Date object allows for inequality comparisson
         * but mishandles incorrect dates. For security and to adhere to the SAML 2.0
         * specification, each piece of data must be validated. All dates generate and
         * passed in go through process.
         */
        function parseUtc( utc ){
            var utcDate,
                validatedUtcDate;

            utcDate = this.validateUtc( utc );

            if( utcDate ){

                validatedUtcDate = this.validateDateUtcValues( utcDate );

                if( validatedUtcDate ){
                    return new Date(utcDate);
                } else {
                    return false;
                }

            }else{
                return false;
            }

        }

        /* @private
         * function validateUtcDateValues
         *
         * Separates and checks each of the indivial input utc values.
         *
         * @param date(array) Regular Expression output from validateUtc(function, utc.js)
         * @return (bool) true if all the values of the input utc data check out
         *
         * Other Notes: Standard Date value checking.
         */
        function validateUtcDateValues( date ) {
            var year,
                month,
                day,
                hour,
                minute,
                second,
                millisecond;

            year = date[1];

            month = date[2];

            day = date[3];

            hour = date[4];

            minute = date[5];

            second = date[6];

            millisecond = date[7];

            if( this.isDate(year, month, day) && this.isTime(hour, minute, second, millisecond) ) {
                return true;
            }else{
                return false;
            }
        }

        /* @private
         * function isDate (utc.js)
         *
         * Validates the input combine to make a legitimate calendar date.
         *
         * @param year(string) The string value of the current year.
         * @param month(string) The string value of the current month.
         * @param day(string) The string value of the current day.
         * @return (bool) true if all the input make up a calendar date.
         *
         * Other Notes: The function here validates the date information. Leap year and
         * month length are considered in the calculation.
         */
        function isDate(year, month, day){
            var nYear,
                nMonth,
                nDay,
                isLeapYear,
                maxMonthDays;

            if(this.isYear(year) && this.isMonth(month) && this.isDay(day)){
                nYear = parseInt(year);
                nMonth = parseInt(month);
                nDay = parseInt(day);

                if( nMonth == 2 ){

                    maxMonthDays = 28;

                    isLeapYear = isInt(nYear / 4);
                    if( isLeapYear ){
                        maxMonthDays = maxMonthDays + 1;
                    }

                }else if( nMonth == 1 || nMonth == 3 || nMonth == 5 || nMonth == 7 || nMonth == 8 || nMonth == 10 || nMonth == 12 ){
                    maxMonthDays=31
                }else if( nMonth == 2 || nMonth == 4 || nMonth == 6 || nMonth == 9 || nMonth == 11 ){
                    maxMonthDays=30
                }else{
                    return false;
                }


                if( nDay > 0 && maxMonthDays =< nDay ){
                    return true;
                }else{
                    return false;
                }

            } else {
                return false;
            }

        }

        /* @private
         * function isYear
         *
         * Validates the input year is of length 4 and is an integer
         *
         * @param year(string) The string of the year to be validated
         * @return (bool) True if the passed in string is an integer 
         * and has a lenght of 4 false, otherwise
         *
         * Other Notes: N/A
         */
        function isYear(year){

            if( year.length == 4 && !isNaN(parseInt(year)) ){
                return true;
            }else{
                return false;
            }

        }

        /* @private
         * function isMonth
         *
         * Validates the input month is of length 2 and is an integer
         *
         * @param month(string) The string of the year to be validated
         * @return (bool) True if the passed in string is an integer 
         * and has a lenght of 2 false, otherwise
         *
         * Other Notes: N/A
         */
        function isMonth(month){
            var nMonth;

            nMonth = parseInt(nMonth);

            if( !isNaN(nMonth) && month.length == 2){
                return true;
            }else{
                return false;
            }
        }

        /* @private
         * function isDay
         *
         * Validates the input day is of length 2 and is an integer
         *
         * @param day(string) The string of the year to be validated
         * @return (bool) True if the passed in string is an integer 
         * and has a lenght of 2 false, otherwise
         *
         * Other Notes: N/A
         */
        function isDay(day){
            var nDay;

            nDay = parseInt(day);

            if( !isNaN(nDay) && day.length == 2 ){
                return true;
            }else{
                return false;
            }
        }

        /* @private
         * function isTime
         *
         * function is used to validate the input time
         *
         * @param hour(string) The string value of the hour
         * @param minute(string) The string value of the minute
         * @param second(string) The string value of the of second
         * @param mSecond(string) The string value of the millisecond
         * @return (bool) Whether or not the passed in value marks a point
         * in the day within UTC standards
         *
         * Other Notes: UTC time standards are in 24 hour time. They also include 
         * a 000-999 representation of the millisecond. These are all considered.
         */
        function isTime(hour, minute, second, mSecond){

            if( this.isHour(hour) && this.isMinute(minute) && this.isSecond(second) && this.isMilli(mSecond) ){
                return true;
            }else{
                return false;
            }

        }


        /* @private
         * function isHour
         *
         * function is used to validate the input hour
         * 
         * @param hour(string) The string value of the hour
         * @return (bool) Whether or not the passed in hour value conforms to
         * UTC standards
         *
         * Other Notes: UTC time standards are in 24 hour time.
         */
        function isHour(hour){
            var nHour;

            nHour = parseInt(hour);

            if( !isNaN(nHour) && hour.length == 2 ){
                if( nHour > -1 && nHour < 24 ){
                    return true;
                }else{
                    return false;
                }
            } else {
                return false;
            }

        }

        /* @private
         * function isMinute
         *
         * function is used to validate the input minute
         *
         * @param minute(string) The string value of the minute
         * @return (bool) Whether or not the passed in hour value conforms to
         * UTC standards
         *
         * Other Notes: N/A
         */
        function isMinute(minute){
            var nMinute;

            nMinute = parseInt(minute);

            if( !isNaN(nMinute) && minute.length == 2 ){
                if( nMinute > -1 && nMinute < 60 ){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        }

        /* @private
         * function isSecond
         *
         * function is used to validate the input second
         *
         * @param second(string) The string value of the second
         * @return (bool) Whether or not the passed in hour value conforms to
         * UTC standards
         *
         * Other Notes: N/A
         */
        function isSecond(second){
            var nSecond;

            nSecond = parseInt(second);

            if( !isNaN(nSecond) && second.length == 2 ){
                if( nSecond > -1 && nSecond < 60 ){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        }

        /* @private
         * function isMilli
         *
         * function is used to validate the input millisecond
         *
         * @param second(string) The string value of the millisecond
         * @return (bool) Whether or not the passed in millisecond value conforms to
         * UTC standards
         *
         * Other Notes: In JavaScript, the millisecond value from the date object is displayed 
         * in three digits at all times. The values range from 000-999.
         */
        function isMilli(mSecond){
            var nmSecond;

            nmSecond = parseInt(nmSecond);

            if( !isNaN(nmSecond) && mSecond.length == 3 ){
                if( nmSecond > 0 && nmSecond < 1000 ){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }

        }

    };

}.call(this));
