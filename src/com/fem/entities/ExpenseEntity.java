package com.fem.entities;

import java.util.Date;
import java.util.List;

import com.google.apphosting.api.DatastorePb.GetResponse.Entity;


public class ExpenseEntity extends Entity {
	private String name; 
	private Date date;
	private List<ExpenseInfo> listPayersInfo;
	private List<ExpenseInfo> listIncludeMemberInfo;
}
